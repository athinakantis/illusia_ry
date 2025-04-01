import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { SupabaseJwtPayload } from 'src/types/supabaseJWTPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    // Retrieve the secret and ensure it's defined
    const jwtSecret = configService.get<string>('SUPABASE_JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('Missing SUPABASE_JWT_SECRET in config');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret, 
    });
  }

  async validate(payload: SupabaseJwtPayload) {
    // Optionally extend validation logic here
    return { userId: payload.sub, email: payload.email };
  }
}