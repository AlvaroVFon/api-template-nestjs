import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './common/config/env.config';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      load: [EnvConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('dbHost'),
        port: parseInt(config.get<string>('dbPort') ?? '5432', 10),
        username: config.get<string>('dbUser'),
        password: config.get<string>('dbPassword'),
        database: config.get<string>('dbName'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get<string>('nodeEnv') !== 'production',
      }),
    }),
    UserModule,
    RoleModule,
    AuthModule,
    TokenModule,
  ],
})
export class AppModule {}
