import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDocument> {
    const existingCategory = await this.categoryModel
      .findOne({ name: createCategoryDto.name })
      .exec();
    if (existingCategory) {
      throw new BadRequestException('Category already exists');
    }
    const category = new this.categoryModel(createCategoryDto);
    return category.save();
  }

  async findAll(): Promise<CategoryDocument[]> {
    return this.categoryModel.find().exec();
  }

  async findById(id: string): Promise<CategoryDocument> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async delete(id: string): Promise<void> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Category not found');
    }
  }

  async findByName(name: string): Promise<CategoryDocument | null> {
    return this.categoryModel.findOne({ name }).exec();
  }

  async searchByName(query: string): Promise<CategoryDocument[]> {
    return this.categoryModel
      .find({ name: { $regex: query, $options: 'i' } })
      .exec();
  }
}
