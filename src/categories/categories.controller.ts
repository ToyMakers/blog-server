import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created.',
    type: CategoryResponseDto,
  })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoriesService.create(createCategoryDto);
    return {
      _id: category._id.toString(),
      name: category.name,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'The categories have been successfully retrieved.',
    type: [CategoryResponseDto],
  })
  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoriesService.findAll();
    return categories.map((category) => ({
      _id: category._id.toString(),
      name: category.name,
    }));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.categoriesService.delete(id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search categories by name' })
  @ApiQuery({
    name: 'query',
    required: true,
    description: 'The search query to filter categories by name',
  })
  @ApiResponse({
    status: 200,
    description: 'The matching categories have been successfully retrieved.',
    type: [CategoryResponseDto],
  })
  async searchByName(
    @Query('query') query: string,
  ): Promise<CategoryResponseDto[]> {
    const categories = await this.categoriesService.searchByName(query);
    return categories.map((category) => ({
      _id: category._id.toString(),
      name: category.name,
    }));
  }
}
