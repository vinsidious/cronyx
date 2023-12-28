"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeormJobLockEntity = void 0;
const typeorm_1 = require("typeorm");
/**
 * @internal
 */
let TypeormJobLockEntity = class TypeormJobLockEntity {
};
exports.TypeormJobLockEntity = TypeormJobLockEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid", { name: "id" }),
    __metadata("design:type", String)
], TypeormJobLockEntity.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], TypeormJobLockEntity.prototype, "jobName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: 0 }),
    __metadata("design:type", Number)
], TypeormJobLockEntity.prototype, "jobInterval", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, precision: 6 }),
    __metadata("design:type", Date)
], TypeormJobLockEntity.prototype, "jobIntervalEndedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: true }),
    __metadata("design:type", Boolean)
], TypeormJobLockEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TypeormJobLockEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TypeormJobLockEntity.prototype, "updatedAt", void 0);
exports.TypeormJobLockEntity = TypeormJobLockEntity = __decorate([
    (0, typeorm_1.Entity)("joblocks"),
    (0, typeorm_1.Index)(["jobName", "jobIntervalEndedAt"], { unique: true })
], TypeormJobLockEntity);
//# sourceMappingURL=typeorm.js.map