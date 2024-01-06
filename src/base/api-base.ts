// import * as path from 'path';
// import { Request } from 'express';

// export = (__dirname: string, serviceName: string, mapperName?: string) => {
//   let name = serviceName;
//   mapperName = mapperName || name;
//   const entityService = require(path.normalize(__dirname + '/../services'))[name];
//   const entityMapper = require(path.normalize(__dirname + '/../mappers'))[mapperName];

//   if (!entityService) {
//     throw new Error(`services.${name} does not exist`);
//   }

//   if (!entityMapper) {
//     throw new Error(`mappers.${mapperName} does not exist`);
//   }

//   return {
//     get: async (req: Request) => {
//       if (!entityService.get) {
//         throw new Error(`METHOD_NOT_SUPPORTED`);
//       }
//       let entity = await entityService.get(req.params.id);

//       if (!entity) {
//         return "Item not exist";
//       }
//       return entityMapper.toModel(entity, req.user);
//     },
//     search: async (req: Request) => {
//       if (!entityService.search) {
//         throw new Error(`METHOD_NOT_SUPPORTED`);
//       }

//       let page = extractPage(req);

//       const entities = await entityService.search(req.query, page, req.user);

//       let pagedItems: PagedItems<any> = {
//         items: entities.items.map((item: any) => {
//           return (entityMapper.toSummary || entityMapper.toModel)(item, req.user);
//         }),
//         total: entities.count || entities.items.length,
//       };

//       if (page) {
//         pagedItems.pageSize = page.limit;
//         pagedItems.pageNo = page.pageNo;
//       }

//       return pagedItems;
//     },
//     update: async (req: Request) => {
//       if (!entityService.update) {
//         throw new Error(`METHOD_NOT_SUPPORTED`);
//       }
//       const entity = await entityService.update(req.params.id, req.body, req.user);
//       return entityMapper.toModel(entity, req.user);
//     },
//     create: async (req: Request) => {
//       if (!entityService.create) {
//         throw new Error(`METHOD_NOT_SUPPORTED`);
//       }
//       const entity = await entityService.create(req.body, req.user);
//       return entityMapper.toModel(entity, req.user);
//     },
//     delete: async (req: Request) => {
//       if (!entityService.remove) {
//         throw new Error(`METHOD_NOT_SUPPORTED`);
//       }
//       await entityService.remove(req.params.id);

//       return `Item removed successfully`;
//     },
//     extractPage
//   };
// };
