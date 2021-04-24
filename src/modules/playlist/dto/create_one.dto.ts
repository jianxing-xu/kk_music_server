import { IsString, IsUrl, } from "class-validator";



export class CreateOneDTO {
  @IsString()
  name: string;
  @IsUrl()
  pic: string;
  @IsString()
  info: string;
}