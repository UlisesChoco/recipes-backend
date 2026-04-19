import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";

@Injectable()
export class MultipartTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();

    if (req.body?.data) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch {
        throw new BadRequestException('Invalid JSON');
      }
    }

    return next.handle();
  }
}