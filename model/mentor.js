const mongoose = require('mongoose')
const Schema = mongoose.Schema


const task = mongoose.Schema({
    title: {
        type: String
    },
    info:{
        type: String
    },
    mcq: [{
        question: {
            type: String
        },
        option: [{
            option1: {
                type: String
            },
            option2: {
                type: String
            },
            option3: {
                type: String
            },
            option4: {
                type: String
            }
        }],
        image: {
            type: String
        },
        answer: {
            type: String
        }
    }],
    exercise: [{
        ques: {
            type: String
        },
        quesImg: {
            type: String
        },
        ans: {
            type: String
        },
        ansImg: {
            type: String
        }
    }],

},{ timestamps: true })

const MentorSchema = mongoose.Schema({
    username: {
        type: String
    },

    email: {
        type: String,
        // unique:[true, "Email is already present"],
    },
    phone: {
        type: Number,
        // unique: [true, "Phone no. is already present"]
    },
    address: {
        type: String
    },
    password: {
        type: String
    },
    exam: {
        type: String
    },
    subject: {
        type: String
    },
    profile: {
        type: String,
        default: "/profiles/default.png"
    },
    studyMaterial: [{
        topic: {
            type: String
        },
        link: {
            type: String
        },
        document: {
            type: String
        }
    }],
    task: [task],
    videoData: [{
        video: {
            type: String
        },
        topic: {
            type: String
        },
        desc: {
            type: String
        },
        postedBy: {
            type: Schema.Types.ObjectId,
            ref: "Mentor"
        }
    },{ timestamps: true }],
    follower: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
}, {
    collection: 'mentors'
});



const Mentor = mongoose.model('Mentor', MentorSchema)

module.exports = Mentor