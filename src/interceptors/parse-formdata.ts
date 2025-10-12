import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { map, Observable } from 'rxjs';
import { BusinessLogicError } from 'src/core/base.error';

@Injectable()
export class ParseMultipartFormInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request: any = context.switchToHttp().getRequest<FastifyRequest>();
        const parts = request.parts();

        request.body = {};
        for await (const part of parts) {
            if (part.type === 'field') {
                request.body[part.fieldname] = this.parseValue(part.fieldname, part.value);;
            } else if (part.type === 'file') {
                const chunks: Buffer[] = [];
                for await (const chunk of part.file) {
                    chunks.push(chunk);
                }
                const buffer = Buffer.concat(chunks);

                const sanitized = this.sanitizeFile(part);
                sanitized.buffer = buffer;

                if (!request.body[part.fieldname]) {
                    request.body[part.fieldname] = [];
                }
                request.body[part.fieldname].push(sanitized);
            }
        }


        return next.handle();
    }

    private sanitizeFile(file: any) {
        // remove `fields` to avoid infinite loop
        const { fields, _events, ...safeFile } = file;
        return safeFile;
    }

    private fieldsToKeepAsString = ['phone', 'idCard', 'zipCode', 'url'];
    private fieldsToParseAsArray = [''];
    private fieldsToParseAsNumber = ['rating'];

    private parseValue(key: string, value: string): any {
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (key && this.fieldsToKeepAsString.includes(key)) return value;
        if (key && this.fieldsToParseAsNumber.includes(key)) return Number(value);
        if (value === '') return undefined;

        // Handle array fields
        if (key && this.fieldsToParseAsArray.includes(key)) {
            if (value === '') return [];
            return value.split(',').map(item => item.trim()).filter(item => item !== '');
        }

        try {
            const parsed = JSON.parse(value);
            if (typeof parsed === 'object' || Array.isArray(parsed)) return parsed;
        } catch (e) { }

        return value;
    }

}
