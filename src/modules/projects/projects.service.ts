import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectType } from './types/projectTypes';
import { CreateProjectDto } from './dto/createProject.dto';

@Injectable()
export class ProjectsService {
    private projects: ProjectType[] = [
        {
            id: 1,
            name: 'Project 1',
            description: 'This is project 1'
        },
        {
            id: 2,
            name: 'Project 2',
            description: 'This is project 2'
        },
        {
            id: 3,
            name: 'Project 3',
            description: 'This is project 3'
        }
    ]

    getProjects() {
        return this.projects;
    }

    getProjectById(id: number) {
        const project = this.projects.find(project => project.id === id)
        if (!project) throw new NotFoundException('Project not found');
        return project;
    }

    createProject(project: CreateProjectDto) : ProjectType {
        const newProject: ProjectType = {
        id: this.projects.length + 1, 
        ...project
        };
        this.projects.push(newProject);
        return newProject;
    }
}
