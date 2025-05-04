import { Module } from "@nestjs/common";
import { TagService } from "./tags.service";
import { TagController } from "./tags.controller";
import { SupabaseService } from "../supabase/supabase.service";

@Module({
    providers: [TagService,SupabaseService],
    exports: [TagService],
    imports: [],
    controllers: [TagController],
})

export class TagModule {}