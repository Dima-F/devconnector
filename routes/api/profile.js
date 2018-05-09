const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const validateProfileInput = require('../../validation/profile');
const Profile = require('../../models/Profile');
const User = require('../../models/User');



router.get('/',passport.authenticate('jwt', { session:false }), (req,res)=>{
    const errors = {};

    Profile.findOne({ user: req.user.id})
        .populate('user',['name','avatar'])
        .then(profile=>{
            if(!profile){
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err=> res.status(404).json(err));
});

router.post('/', passport.authenticate('jwt', { session:false }), (req,res)=>{

    const { errors, isValid } = validateProfileInput(req.body);

    //Chekc validation
    if(!isValid) {
        return res.status(400).json(errors);
    }

    const profileFields = {};
    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    if(typeof req.body.skills !== 'undefined'){
        profileFields.skills = req.body.skills.split(',');
    }
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.lindedin) profileFields.social.lindedin = req.body.lindedin;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;

    Profile.findOne({ user: req.user.id }).then(profile => {
        if(profile) {
            //Update
            Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set:profileFields },
                { new: true }
            )
            .then(profile=>res.json(profile));
        } else {
            //Create

            //Check if handle exists
            Profile.findOne({ handle: profileFields.handle })
                .then(profile=>{
                    errors.handle = 'Handle already exists';
                    res.status(400).json(errors);
                });

            //Save profile
            new Profile(profileFields).save().then(profile=>res.json(profile));
        }
    });

});

router.get('/handle/:handle', (req, res)=>{
    const errors = {};

    Profile.findOne({ handle: req.params.handle })
        .populate('user',['name', 'avatar'])
        .then(profile=> {
            if(!profile){
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            return res.json(profile);
        })
        .catch(err=>res.status(404).json(err));
});

router.get('/user/:user_id', (req, res)=>{
    const errors = {};

    Profile.findOne({ user: req.params.user_id })
        .populate('user',['name', 'avatar'])
        .then(profile=> {
            if(!profile){
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            return res.json(profile);
        })
        .catch(err=>res.status(404).json({profile:'There is no profile for this user'}));
});

router.get('/all', (req, res)=>{
    const errors = {};

    Profile.find()
        .populate('user',['name', 'avatar'])
        .then(profiles => {
            if(!profiles) {
                errors.noprofile = 'There are no profiles';
                return res.status(404).json(errors);
            }
            res.json(profiles);
        })
        .catch(err=>res.status(404).json({profile:'There are no profiles'}));
});

module.exports = router;
