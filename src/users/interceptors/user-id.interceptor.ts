import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    ForbiddenException
  } from "@nestjs/common";
  import { Observable } from "rxjs";
  import { tap } from "rxjs/operators";
  
  @Injectable()
  export class UserIdInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const id  = request.user.id;
      if (!id ) {
        throw new ForbiddenException(
          "user id must be not empty"
        );
      }
  
      return next
        .handle()
        .pipe(tap(() => console.log("Request handled successfully")));
    }
  }
  