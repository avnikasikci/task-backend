// import { Module } from "@nestjs/common";
// import { UsersModule } from "./users.module";

// @Module({
//   imports: [
//     UsersModule,
//     JwtModule.registerAsync({
//       useFactory: (configService: ConfigService) => {
//         return {
//           secret: configService.get<string>('JWT_SECRET_KEY'),
//           signOptions: { expiresIn: '60s' },
//         };
//       },
//       inject: [ConfigService],
//     }),
//   ],
//   ...
// })
// export class AuthModule {}