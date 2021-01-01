import React from 'react'

const Header = ({ course }) => (
    <h2>{course.name}</h2>
)

const Part = ({ part }) => {
    return (
        <p>
            {part.name} {part.exercises}
        </p>
    )
}

const Content = ({ course }) => {
    return (
        <div>
            {course.parts.map(part =>
                <Part key={part.id} part={part} />
            )}
        </div>
    )
}

const Total = ({ course }) => (
    <b>
        total of {course.parts.reduce((s, p) => s + p.exercises, 0)} exercises
    </b>
)

const Course = ({ course }) => {
    return (
        <div>
            <Header course={course} />
            <Content course={course} />
            <Total course={course} />
        </div>
    )
}
export default Course