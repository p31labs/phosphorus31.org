/**
 * Printer Integration
 * Direct printer communication for pushing sliced models
 * 
 * "Push straight to printer"
 */

export interface Printer {
  id: string;
  name: string;
  type: 'usb' | 'network' | 'octoprint' | 'klipper' | 'marlin';
  connection: string; // USB path, IP address, etc.
  status: 'idle' | 'printing' | 'paused' | 'error';
  capabilities: {
    maxX: number;
    maxY: number;
    maxZ: number;
    hasHeatedBed: boolean;
    hasAutoLeveling: boolean;
    supportedFormats: string[];
  };
}

export interface PrintJob {
  id: string;
  printerId: string;
  gcode: string;
  status: 'queued' | 'printing' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-1
  startedAt?: number;
  completedAt?: number;
  error?: string;
}

export interface PrinterConfig {
  enabled: boolean;
  autoConnect: boolean;
  defaultPrinter?: string;
  timeout: number; // milliseconds
}

export class PrinterIntegration {
  private config: PrinterConfig;
  private printers: Map<string, Printer> = new Map();
  private jobs: Map<string, PrintJob> = new Map();
  private activeConnection: any = null;

  constructor(config?: Partial<PrinterConfig>) {
    this.config = {
      enabled: config?.enabled ?? true,
      autoConnect: config?.autoConnect ?? false,
      defaultPrinter: config?.defaultPrinter,
      timeout: config?.timeout ?? 30000
    };
  }

  /**
   * Initialize printer integration
   */
  public async init(): Promise<void> {
    if (!this.config.enabled) {
      console.log('🖨️ Printer Integration disabled');
      return;
    }

    await this.scanPrinters();
    
    if (this.config.autoConnect && this.config.defaultPrinter) {
      await this.connect(this.config.defaultPrinter);
    }

    console.log('🖨️ Printer Integration initialized');
  }

  /**
   * Scan for available printers
   */
  public async scanPrinters(): Promise<Printer[]> {
    const printers: Printer[] = [];

    // Scan USB printers
    try {
      const usbPrinters = await this.scanUSBPrinters();
      printers.push(...usbPrinters);
    } catch (error) {
      console.warn('USB printer scan failed:', error);
    }

    // Scan network printers
    try {
      const networkPrinters = await this.scanNetworkPrinters();
      printers.push(...networkPrinters);
    } catch (error) {
      console.warn('Network printer scan failed:', error);
    }

    // Update printers map
    printers.forEach(printer => {
      this.printers.set(printer.id, printer);
    });

    console.log(`🖨️ Found ${printers.length} printers`);
    return printers;
  }

  /**
   * Scan USB printers
   */
  private async scanUSBPrinters(): Promise<Printer[]> {
    // In browser, use Web Serial API
    if (typeof navigator !== 'undefined' && 'serial' in navigator) {
      // Web Serial API available
      const ports = await (navigator as any).serial.getPorts();
      return ports.map((port: any, index: number) => ({
        id: `usb_${index}`,
        name: port.getInfo().usbVendorId ? `USB Printer ${index + 1}` : `Serial Printer ${index + 1}`,
        type: 'usb' as const,
        connection: `serial:${index}`,
        status: 'idle' as const,
        capabilities: {
          maxX: 200,
          maxY: 200,
          maxZ: 200,
          hasHeatedBed: true,
          hasAutoLeveling: false,
          supportedFormats: ['gcode']
        }
      }));
    }

    // Fallback: return empty array
    return [];
  }

  /**
   * Scan network printers
   */
  private async scanNetworkPrinters(): Promise<Printer[]> {
    // Scan for OctoPrint instances
    const octoprintPrinters: Printer[] = [];
    
    // Common OctoPrint ports
    const commonPorts = [5000, 8080];
    const commonIPs = ['192.168.1.100', '192.168.1.101', 'localhost'];

    // In production, implement proper network scanning
    // For now, return empty array
    return octoprintPrinters;
  }

  /**
   * Connect to printer
   */
  public async connect(printerId: string): Promise<void> {
    const printer = this.printers.get(printerId);
    if (!printer) {
      throw new Error(`Printer ${printerId} not found`);
    }

    try {
      switch (printer.type) {
        case 'usb':
          await this.connectUSB(printer);
          break;
        case 'network':
        case 'octoprint':
          await this.connectNetwork(printer);
          break;
        default:
          throw new Error(`Unsupported printer type: ${printer.type}`);
      }

      this.activeConnection = printerId;
      console.log(`🖨️ Connected to printer: ${printer.name}`);
    } catch (error) {
      console.error(`❌ Failed to connect to printer ${printerId}:`, error);
      throw error;
    }
  }

  /**
   * Connect to USB printer
   */
  private async connectUSB(printer: Printer): Promise<void> {
    if (typeof navigator !== 'undefined' && 'serial' in navigator) {
      // Web Serial API connection
      const port = await (navigator as any).serial.requestPort();
      await port.open({ baudRate: 115200 });
      // Store port for later use
      (printer as any).port = port;
    } else {
      throw new Error('Web Serial API not available');
    }
  }

  /**
   * Connect to network printer
   */
  private async connectNetwork(printer: Printer): Promise<void> {
    // Connect via WebSocket or HTTP
    // Implementation depends on printer type (OctoPrint, Klipper, etc.)
    console.log(`Connecting to network printer: ${printer.connection}`);
  }

  /**
   * Disconnect from printer
   */
  public async disconnect(): Promise<void> {
    if (this.activeConnection) {
      const printer = this.printers.get(this.activeConnection);
      if (printer && (printer as any).port) {
        await (printer as any).port.close();
      }
      this.activeConnection = null;
      console.log('🖨️ Disconnected from printer');
    }
  }

  /**
   * Print G-code
   */
  public async printGCode(gcode: string, printerId?: string): Promise<PrintJob> {
    const targetPrinterId = printerId || this.activeConnection;
    if (!targetPrinterId) {
      throw new Error('No printer connected');
    }

    const printer = this.printers.get(targetPrinterId);
    if (!printer) {
      throw new Error(`Printer ${targetPrinterId} not found`);
    }

    const job: PrintJob = {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      printerId: targetPrinterId,
      gcode,
      status: 'queued',
      progress: 0,
      startedAt: Date.now()
    };

    this.jobs.set(job.id, job);

    // Start printing
    try {
      await this.sendGCode(printer, gcode);
      job.status = 'printing';
      printer.status = 'printing';

      // Monitor progress (simplified)
      this.monitorPrintJob(job, printer);

      console.log(`🖨️ Started print job: ${job.id}`);
    } catch (error: any) {
      job.status = 'failed';
      job.error = error.message;
      printer.status = 'error';
      throw error;
    }

    return job;
  }

  /**
   * Send G-code to printer
   */
  private async sendGCode(printer: Printer, gcode: string): Promise<void> {
    switch (printer.type) {
      case 'usb':
        await this.sendGCodeUSB(printer, gcode);
        break;
      case 'network':
      case 'octoprint':
        await this.sendGCodeNetwork(printer, gcode);
        break;
      default:
        throw new Error(`Unsupported printer type: ${printer.type}`);
    }
  }

  /**
   * Send G-code via USB
   */
  private async sendGCodeUSB(printer: Printer, gcode: string): Promise<void> {
    const port = (printer as any).port;
    if (!port) {
      throw new Error('Printer not connected');
    }

    const lines = gcode.split('\n');
    for (const line of lines) {
      if (line.trim()) {
        const encoder = new TextEncoder();
        await port.writable.getWriter().write(encoder.encode(line + '\n'));
        await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
      }
    }
  }

  /**
   * Send G-code via network
   */
  private async sendGCodeNetwork(printer: Printer, gcode: string): Promise<void> {
    // Send via HTTP/WebSocket to OctoPrint/Klipper
    const response = await fetch(`${printer.connection}/api/files/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        select: true,
        print: true,
        file: new Blob([gcode], { type: 'text/plain' })
      })
    });

    if (!response.ok) {
      throw new Error(`Network print failed: ${response.statusText}`);
    }
  }

  /**
   * Monitor print job
   */
  private monitorPrintJob(job: PrintJob, printer: Printer): void {
    // Simplified progress monitoring
    // In production, parse printer responses
    const interval = setInterval(() => {
      if (job.status === 'printing') {
        // Simulate progress (in production, get from printer)
        job.progress = Math.min(job.progress + 0.01, 1);

        if (job.progress >= 1) {
          job.status = 'completed';
          job.completedAt = Date.now();
          printer.status = 'idle';
          clearInterval(interval);
        }
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  /**
   * Get printers
   */
  public getPrinters(): Printer[] {
    return Array.from(this.printers.values());
  }

  /**
   * Get print jobs
   */
  public getPrintJobs(): PrintJob[] {
    return Array.from(this.jobs.values());
  }

  /**
   * Get active connection
   */
  public getActiveConnection(): string | null {
    return this.activeConnection;
  }

  /**
   * Cancel print job
   */
  public async cancelJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    if (job.status === 'printing') {
      // Send cancel command to printer
      const printer = this.printers.get(job.printerId);
      if (printer) {
        await this.sendGCode(printer, 'M112\n'); // Emergency stop
      }
    }

    job.status = 'cancelled';
    const printer = this.printers.get(job.printerId);
    if (printer) {
      printer.status = 'idle';
    }
  }

  /**
   * Dispose resources
   */
  public async dispose(): Promise<void> {
    await this.disconnect();
    this.printers.clear();
    this.jobs.clear();
  }
}
