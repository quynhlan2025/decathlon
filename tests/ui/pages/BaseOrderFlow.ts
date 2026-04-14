// logic/base-order.flow.ts
export abstract class BaseOrderFlow {
    // Quy trình chung (Template Method)
    async executeOrderFlow(data: any) {
      await this.validateStock();      // 50% giống: Kiểm tra kho
      await this.calculateTax();       // 50% khác: Thuế VN khác SG
      await this.processPayment();     // 50% khác: Cổng thanh toán khác nhau
      await this.sendConfirmation();   // 50% giống: Gửi email
    }
  
    // Bước giống nhau: Viết code trực tiếp
    private async validateStock() { 
      console.log("Checking global inventory..."); 
    }
  
    private async sendConfirmation() { 
      console.log("Sending confirmation email..."); 
    }
  
    // Bước khác nhau: Để lớp con định nghĩa (Specialized Logic)
    abstract calculateTax(): Promise<void>;
    abstract processPayment(): Promise<void>;
  }