const express = require("express")
const validator = require('validator')
const multer = require('multer')

const Mentor_test = require("../model/test_mentor");
const { db } = require("../model/test_mentor");




exports.mentors_post_test = async (req, res, next) => {
    try{

        if(req.userData.id){


            const data =  {
                subject: req.body.subject,
                test: [
                    { question: req.body.question , 
                      image: "/images/" + req.file.filename, 
                      option: [{
                          option1: req.body.option1,
                          option2: req.body.option2,
                          option3: req.body.option3,
                          option4: req.body.option4,
                      }], 
                      answer: req.body.answer }                
                ]
            }
    
            const response = await Mentor_test.create(data)
    
    
            res.status(201).send(response);


        }else{
            res.status(300).json({ error: "You are not authorised"})
        }


    }


    catch(e){
        res.status(400).send(e);
    }                          
}


exports.mentors_get_api = async (req, res) => {
    try {
        const data = await Mentor_test.find();

        res.status(200).json(data.concat(Math.random()));

    } catch (error) {
        res.status(500).send({ error: error.message })
    }

}


exports.mentors_get_test = async (req, res) => {
    try {
        const subject = req.params.subject;
        const data = await Mentor_test.findOne({ subject });


        if (!data) {
            return res.status(404).send(e);
        } else {
            res.status(200).send(data);
        }

    } catch (e) {
        res.status(500).send(e);
    }
}

exports.mentors_patch_test = async (req, res) => {
    try {
        const subject = req.params.subject;
        const updateTest = await Mentor_test.findOneAndUpdate(subject, req.body, {
            new: true
        });
        res.send(updateTest);

    } catch (e) {
        res.status(404).send(e);
    }
}


exports.mentors_delete_test = async (req, res) => {
    try {
        const subject = req.params.subject;
        const deleteTest = await Student.findByIdAndDelete(subject)

        if (!_id) {
            return res.status(400).send();
        } else {
            res.send(deleteTest);
        }


    } catch (e) {
        res.status(500).send(e);
    }
}
