import { Module } from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";
import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";

@Module({
    providers: [SupabaseService, AccountService],
    exports: [],
    imports: [],
    controllers: [AccountController],
})

export class AccountModule {}