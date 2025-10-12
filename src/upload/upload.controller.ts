import { Controller, Post, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { UploadService } from './upload.service';
import { CreatedResponse } from 'src/core/successResponse';
import { UploadImageDto } from './dto/upload-image.dto';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) { }

  @Post('image')
  @ApiBody({ type: UploadImageDto })
  @ApiConsumes('multipart/form-data')
  async upload(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const file = await req.file();

    if (!file) {
      return res.status(400).send({
        statusCode: 400,
        message: 'No file uploaded',
      });
    }

    const url = await this.uploadService.uploadImage(file, file.filename, 'avatars');

    return res.send(new CreatedResponse({
      data: { url },
      message: 'Image uploaded successfully',
    }));
  }
}
