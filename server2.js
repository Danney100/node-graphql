const express = require('express');
const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
    },
    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
    },
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`);

const coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world application with Node, Express, MongoDB, Mocha, and more',
        topic: 'Javascript',
        url: 'https://codingthesmartway.com/courses/node.js/'
    },
    {
        id: 2,
        title: 'Brad Traversy',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world node.js',
        topic: 'javascript',
        url: 'https://codingthesmartway.com/courses/node.js-express-mongodb/'
    },
    {
        id: 3,
        title: 'Javascript: Understanding the weird parts',
        author: 'Anthony Alicea',
        description: 'An advanced Javascript course for everyone!',
        topic: 'Javascript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
]

const getCourse = (args) => {
    const id = args.id;
    return coursesData.filter(course => {
        return course.id == id;
    })[0];
}

const getCourses = (args) => {
    if (args.topic) {
        const topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
}

const updateCourseTopic = ({id, topic}) => {
    coursesData.map(course => {
        if (course.id === id) {
            course.topic = topic;
            return course;
        }
    });
    return coursesData.filter(course => course.id === id) [0];
};

const root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic
};

//craet an express server and a graphql endpoint
const app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('express graphql server running! localhost:4000'));
