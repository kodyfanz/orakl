import { ApiProperty } from '@nestjs/swagger'

export class ContractDto {
  @ApiProperty()
  address: string
}
