import { Router } from "express";
import { medicineController } from "./medicine.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";


const router = Router()

router.get('/', medicineController.getAllMedicines);
router.get('/:id', medicineController.getMedicineById);

router.post('/', auth(Role.SELLER, Role.ADMIN), medicineController.createMedicine)

router.delete('/:id',auth(Role.SELLER, Role.ADMIN), medicineController.deleteMedicineById)
router.patch('/:id', auth(Role.SELLER, Role.ADMIN), medicineController.updateMedicineId)

export const medicineRoutes = router