export class LicencesConfig {
    public UP_TO_DATE: number = 1
    public RENEW: number = 2
    public EXPIRED: number = 3
    public ACTIVATE: number = 4

    /**
   * Same algorithm in LicenceRepository
   * @param licence 
   * @returns 
   */
     public expirationStatus(licence: any): number {
        let licencePeriods = licence.type
        const now: any = new Date()
        if (licence.expired_at != null) {
          const date = new Date(licence.expired_at).getTime()
          const diffInMs = date - now;
          const days = diffInMs / (1000 * 60 * 60 * 24);
          const billingDays = (10 * licencePeriods) - (licencePeriods * 2)
          const daysOfGrace = ((licencePeriods - 1) + 2) * -1
          if (days < daysOfGrace) {
            // The purchase order is expired
            return this.EXPIRED
          }
          if (days > billingDays) {
            return this.UP_TO_DATE
          } else {
            return this.RENEW
          }
        } else {
          const planExpiredDate = new Date(licence.plan.expired_date).getTime()
          const diffInMs = planExpiredDate - now;
          const days = diffInMs / (1000 * 60 * 60 * 24);
          if (days < 0) {
            return this.EXPIRED
          } else {
            return this.ACTIVATE
          }
        }
    
      }
}