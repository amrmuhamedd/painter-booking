import { Controller, Post, Body, Get, Delete, Param, Query, UseGuards, Logger } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AvailabilityService } from '../services/availability.service';
import { JwtAuthGuard } from '../../authentication/guards/jwtauth.guard';
import { PainterGuard } from '../../authentication/guards/painter.guard';
import { LoggedInUser } from '../../authentication/decorators/get-current-user';
import { User } from '../../authentication/entities/users.entity';
import { CreateAvailabilityDto, FilterAvailabilityDto, AvailabilityResponseDto } from '../dto/availability.dto';

@ApiTags('availability')
@Controller('availability')
export class AvailabilityController {
  private readonly logger = new Logger(AvailabilityController.name);
  
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PainterGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new availability slot for the painter' })
  @ApiResponse({ 
    status: 201, 
    description: 'Availability slot created successfully',
    type: AvailabilityResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Time slot overlaps with existing availability' })
  async createAvailability(
    @LoggedInUser() user: Partial<User>,
    @Body() createAvailabilityDto: CreateAvailabilityDto,
  ) {
    this.logger.log(`User ${user.id} with role ${user.role} attempting to create availability`);
    return this.availabilityService.createAvailability(user.id, createAvailabilityDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, PainterGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all availability slots for the current painter' })
  @ApiResponse({ 
    status: 200,
    description: 'List of painter\'s availability slots',
    type: [AvailabilityResponseDto]
  })
  async getPainterAvailabilities(@LoggedInUser() user: Partial<User>) {
    return this.availabilityService.getPainterAvailabilities(user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all availability slots with optional filtering' })
  @ApiResponse({ 
    status: 200,
    description: 'List of availability slots',
    type: [AvailabilityResponseDto]
  })
  async getAllAvailabilities(@Query() filterDto: FilterAvailabilityDto) {
    return this.availabilityService.getAvailabilitiesByFilter(filterDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PainterGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an availability slot' })
  @ApiResponse({ status: 200, description: 'Availability slot deleted successfully' })
  @ApiResponse({ status: 404, description: 'Availability slot not found' })
  async deleteAvailability(
    @LoggedInUser() user: Partial<User>,
    @Param('id') id: string,
  ) {
    await this.availabilityService.deleteAvailability(id, user.id);
    return { message: 'Availability deleted successfully' };
  }
}
