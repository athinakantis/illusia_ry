"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const item_controller_1 = require("../item/item.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const views_controller_1 = require("../views/views.controller");
const bookings_controller_1 = require("../bookings/bookings.controller");
const reservations_controller_1 = require("../reservations/reservations.controller");
const admin_controller_1 = require("../admin/admin.controller");
const tags_controller_1 = require("../tags/tags.controller");
const categories_module_1 = require("../categories/categories.module");
const tags_module_1 = require("../tags/tags.module");
const categories_controller_1 = require("../categories/categories.controller");
const admin_module_1 = require("../admin/admin.module");
const bookings_module_1 = require("../bookings/bookings.module");
const view_module_1 = require("../views/view.module");
const reservations_module_1 = require("../reservations/reservations.module");
const mailer_module_1 = require("../mailer/mailer.module");
const system_logs_module_1 = require("../system_logs/system_logs.module");
const system_logs_controller_1 = require("../system_logs/system_logs.controller");
const item_module_1 = require("../item/item.module");
const guest_module_1 = require("../guest/guest.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(auth_middleware_1.AuthMiddleware).forRoutes(item_controller_1.ItemController, views_controller_1.ViewsController, bookings_controller_1.BookingController, reservations_controller_1.ItemReservationsController, admin_controller_1.AdminController, tags_controller_1.TagController, categories_controller_1.CategoryController, system_logs_controller_1.SystemLogsController);
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            categories_module_1.CategoriesModule,
            tags_module_1.TagModule,
            admin_module_1.AdminModule,
            bookings_module_1.BookingModule,
            view_module_1.ViewsModule,
            reservations_module_1.ItemReservationsModule,
            mailer_module_1.MailerModule,
            item_module_1.ItemModule,
            system_logs_module_1.SystemLogsModule,
            guest_module_1.GuestModule
        ],
        controllers: [
            app_controller_1.AppController,
        ],
        providers: [
            app_service_1.AppService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map