import { Module } from "@nestjs/common";
import { SupabaseService } from "./supabase.service";

@Module({
    providers: [SupabaseService],
    exports: [SupabaseService],
    imports: [],
    controllers: [],
})

export class SupabaseModule {}