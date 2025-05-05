import { Module } from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";
import { AccountController } from "./account.controller";

@Module({
    providers: [SupabaseService],
    exports: [],
    imports: [],
    controllers: [AccountController],
})

export class AccountModule {}