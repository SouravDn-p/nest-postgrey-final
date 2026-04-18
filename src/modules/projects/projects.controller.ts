import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/createProject.dto';
import { ProjectType } from './types/projectTypes';

@Controller('projects')
export class ProjectsController {
    constructor (private readonly projectsService: ProjectsService){}

    @Get()
    async getAllProjects (){
        return await this.projectsService.getProjects()
    }

    @Get(':id')
    async getProjectById (@Param('id') id: number){
        return await this.projectsService.getProjectById(id)
    }

    @Post('create')
    async createProject (@Body() createProjectDto: CreateProjectDto) : Promise<ProjectType>{
       const result = await this.projectsService.createProject(createProjectDto);
       return result;
    }
}
