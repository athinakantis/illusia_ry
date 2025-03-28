<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
</p>

## Project setup

Create .env file in ✅backend/ ( ❌src/ )

```sh
SUPABASE_URL=SUPABASE_URL
SUPABASE_ANON_KEY=YourKey
SUPABASE_SERVICE_ROLE_KEY=ServiceRoleKey
```

```bash
# Install packages
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## __Endpoints__

Check these endpoints after starting the server to make sure everything is working OK.

You can access these easily by __copying the urls into your browser__.

### Using the Anon key

These endpoints are using the __Anon__ key and I think you need to __authenticate__ with Supabase before you would be able to see any of the tables. We probably need to set that up.

```html
http://localhost:5001

http://localhost:5001/test/supabase
```

### Using the Service Role key

These endpoints are using the __Servic Role__ key and basically have access to __perform CRUD__ if needed.

```html
http://localhost:5001/test-role/admins

http://localhost:5001/test-role/users
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).


## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
