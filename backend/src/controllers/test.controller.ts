import { Controller } from '@nestjs/common';
import { SupabaseService } from '../services/supabase.service';



@Controller('test') // URL http://localhost:5001/test
export class TestController {
  constructor(private readonly supabaseService: SupabaseService) {}

  // Combined endpoint to test that the interceptor is setting the token
  // and to query the 'test' table.
  

}
