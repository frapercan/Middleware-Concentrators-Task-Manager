
/**
 * @swagger
 * definitions:
 *   Concentrator:
 *     type: object
 *     required:
 *       - id_concentrador
 *       - lvcid
 *     properties:
 *       id_paquete:
 *         type: number
 *       lvcid:
 *         type: string
 */
class Concentrator {
    constructor (id_concentrador, lvcid,cercoVersion,hwVersion,romVersion,modemVersion,varMem,diskMem,tmpn2peloadMem,tmpDailyClousureMem,modemRebootPeriodicity,cercoRebootPeriodicity) {
      this.id_concentrador = id_concentrador,
      this.lvcid = lvcid,
      this.cercoVersion = cercoVersion,
      this.hwVersion = hwVersion,
      this.romVersion = romVersion,
      this.modemVersion = modemVersion,
      this.varMem = varMem,
      this.diskMem = diskMem,
      this.tmpn2ploadMem = tmpn2peloadMem,
      this.tmpDailyClousureMem = tmpDailyClousureMem,
      this.modemRebootPeriodicity = modemRebootPeriodicity,
      this.cercoRebootPeriodicity = cercoRebootPeriodicity
    }}


module.exports = Concentrator