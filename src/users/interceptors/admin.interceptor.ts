import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AdminInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Check if the user is an admin
    const { admin } = request.user;
    if (!request.user || admin !== "admin") {
      throw new ForbiddenException(
        "You do not have permission to access this resource"
      );
    }

    return next.handle().pipe();
  }
}
