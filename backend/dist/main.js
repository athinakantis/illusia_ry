"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const path_1 = require("path");
const app_module_1 = require("./modules/app/app.module");
const common_1 = require("@nestjs/common");
console.log('Node flags:', process.execArgv);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'frontend'));
    app.setBaseViewsDir((0, path_1.join)(__dirname, '..', 'frontend'));
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    const port = process.env.PORT || 5001;
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map