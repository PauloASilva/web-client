import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import UserBadge from '../badges/UserBadge';
import secureApiFetch from '../../services/api';
import DeleteButton from '../ui/buttons/Delete';
import { IconLeft } from '../icons';

class ProjectDetails extends Component {
    constructor(props) {
        super(props)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleAddTask = this.handleAddTask.bind(this)
    }
    state = {
        project: null,
        tasks: [],
        targets: [],
        vulnerabilities: []
    }

    componentDidMount() {

        const id = this.props.match.params.id;
        Promise.all([
            secureApiFetch(`/projects/${id}`, {
                method: 'GET'
            }),
            secureApiFetch(`/projects/${id}/tasks`, {
                method: 'GET'
            }),
            secureApiFetch(`/projects/${id}/targets`, {
                method: 'GET'
            }),
            secureApiFetch(`/projects/${id}/vulnerabilities`, {
                method: 'GET'
            })
        ])
            .then((responses) => Promise.all(responses.map((response) => response.json())))
            .then((responses) => {
                const newState = {
                    project: responses[0],
                    tasks: responses[1],
                    targets: responses[2],
                    vulnerabilities: responses[3],
                };
                this.setState(newState)
                document.title = `${newState.project.name} | Reconmap`;
            })
            .catch((error) => alert(error));
    }
    handleAddTask = () => {
        this.props.history.push(`/project/${this.props.match.params.id}/tasks/create`)
    }
    handleDelete(id) {
        if (window.confirm('Are you sure you want to delete this project?')) {
            secureApiFetch(`/projects/${id}`, {
                method: 'DELETE'
            })
                .then(() => { this.props.history.goBack() })
                .catch(e => console.log(e))

        }
    }

    render() {
        if (!this.state.project) {
            return 'Loading...'
        }
        return (
            <>
                <section className='heading' >
                    <button onClick={() => this.props.history.goBack()}><IconLeft /></button>
                    <h1 className='mr-auto ml-4'>{this.state.project.name}</h1>
                    <div className='flex items-center justify-between gap-4'>
                        <button onClick={() => document.location = `/project/${this.state.project.id}/report`}>Generate Report</button>
                        <DeleteButton onClick={() => this.handleDelete(this.state.project.id)} />
                    </div>
                </section>

                <section className='grid lg:grid-cols-3 gap-4 my-4'>
                    <div className='base'>
                        <h2>Description</h2>
                        <p>{this.state.project.description}</p>
                    </div>
                    <div className='base'>
                        <h2>Target(s)</h2>
                        <table className='font-mono text-sm w-full' >
                            <thead>
                                <tr><th>Host</th><th>uri</th></tr>
                            </thead>
                            <tbody>
                                {this.state.targets.map((target, index) =>
                                    <tr key={index}><td>{target.kind}</td><td>{target.name}</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className='base'>
                        <h2>Vulnerabilities</h2>
                            <ul>
                                {
                                    this.state.vulnerabilities.map((vuln, index) =>
                                        <li key={index}>{vuln.summary}</li>
                                    )
                                }
                            </ul>
                            <footer>

                        <button href="add.html" >Add New Vulnerability</button>
                            </footer>
                    </div>
                </section>
                <section className='grid lg:grid-cols-3 gap-4 my-4'>
                    <article className='base'>
                        <h2>Team</h2>
                        <div className='flex flex-wrap'>
                            <UserBadge name='Santiago Lizardo' role='Full Stack Dev' />
                        </div>
                    </article>
                    <article className='base'>
                        <h2>Tasks <small>1/{this.state.tasks.length} completed</small></h2>
                        <div className='flex flex-col gap-2 mb-2'>
                            { this.state.tasks.map((task, index) =>
                                <div className='flex flex-row items-center justify-start'>
                                    <input type="checkbox" checked="checked" readOnly className='mr-4'/> 
                                    <Link to={"/tasks/" + task.id}>{task.name}</Link>
                                    <Link className=' ml-auto' to={"/tasks/" + task.id + "/upload"}><button className='w-20'>Upload results</button></Link>
                                </div>
                                )
                            }
                        </div>
                        <footer>
                            <button onClick={this.handleAddTask}>Add task</button>
                        </footer>
                    </article>
                </section>
            </>
        )
    }
}

export default ProjectDetails