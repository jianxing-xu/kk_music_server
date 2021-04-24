import { IsString } from "class-validator";



export class RegisterDTO {
  @IsString({ message: "参数类型错误" })
  username: string;

  @IsString({ message: "参数类型错误" })
  password: string;
}