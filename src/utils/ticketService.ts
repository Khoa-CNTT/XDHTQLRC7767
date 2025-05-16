import axiosInstance from "./axiosConfig";

/**
 * Interface for ticket request data
 */
export interface TicketRequestDTO {
  type: string;
  price: number;
  id_showTime: number;
  id_customer?: string | number;
  chairIds: string[];
}

/**
 * Interface for ticket response data
 */
export interface TicketResponseDTO {
  id: number;
  nameMovie: string;
  startTime: string;
  chairs: string;
  customerName: string;
  isUsed: boolean;
}

/**
 * Interface for ticket history data
 */
export interface TicketHistoryDTO {
  id: number;
  movieName: string;
  date: string;
  cinemaName: string;
  startTime: string;
}

/**
 * Service to handle ticket-related API requests
 */
class TicketService {
  /**
   * Create multiple tickets (one for each seat)
   * @param ticketData Ticket request data
   * @returns Response from the API
   */
  async createTickets(
    ticketData: TicketRequestDTO
  ): Promise<TicketResponseDTO> {
    try {
      console.log("===== TICKET CREATE API CALL =====");
      console.log("Request Payload:", JSON.stringify(ticketData, null, 2));

      // Validate data before sending
      if (!ticketData.id_showTime || isNaN(ticketData.id_showTime)) {
        throw new Error(`Invalid id_showTime: ${ticketData.id_showTime}`);
      }

      if (!ticketData.chairIds || ticketData.chairIds.length === 0) {
        throw new Error("No seats selected for ticket creation");
      }

      // Check chairIds format
      console.log("Chair IDs:", ticketData.chairIds);
      console.log("Chair IDs type:", typeof ticketData.chairIds);

      // Make sure chairIds is an array of strings
      let chairIdsArray: string[] = [];

      if (Array.isArray(ticketData.chairIds)) {
        chairIdsArray = ticketData.chairIds.map((id) => String(id));
      } else if (ticketData.chairIds) {
        chairIdsArray = [String(ticketData.chairIds)];
      }

      // Log để debug
      console.log("Converted chairIds:", chairIdsArray);

      // Create a new payload with the correct chairIds format
      const fixedPayload = {
        ...ticketData,
        chairIds: chairIdsArray,
      };

      console.log("Fixed payload:", JSON.stringify(fixedPayload, null, 2));

      // Thêm thông tin thêm về request để debug
      console.log("API Endpoint: /api/tickets");
      console.log("Request Headers:", {
        Authorization: "Bearer [TOKEN]", // Không hiển thị token đầy đủ vì lý do bảo mật
        "Content-Type": "application/json",
      });

      // Tăng timeout cho phép request chạy lâu hơn (30 giây)
      const response = await axiosInstance.post("/api/tickets", fixedPayload, {
        timeout: 30000, // 30 second timeout
      });
      console.log("Response:", response.data);
      console.log("==============================");
      return response.data;
    } catch (error: unknown) {
      console.error("===== TICKET API ERROR =====");
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }

      const axiosError = error as { response?: { status: number; data: any } };
      if (axiosError.response) {
        console.error("Status:", axiosError.response.status);
        console.error(
          "Data:",
          JSON.stringify(axiosError.response.data, null, 2)
        );
      }

      console.error("==========================");
      throw error;
    }
  }

  /**
   * Get ticket by ID
   * @param id Ticket ID
   * @returns Ticket data
   */
  async getTicketById(id: number): Promise<TicketResponseDTO> {
    try {
      const response = await axiosInstance.get(`/api/tickets/mobile/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ticket with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update ticket status (mark as used)
   * @param id Ticket ID
   * @returns Response from the API
   */
  async updateTicketStatus(id: number): Promise<TicketResponseDTO> {
    try {
      const response = await axiosInstance.put(`/api/tickets/mobile/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error updating ticket status for ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get tickets by customer ID
   * @param customerId Customer ID
   * @returns List of ticket history items
   */
  async getTicketsByCustomerId(
    customerId: number
  ): Promise<TicketHistoryDTO[]> {
    try {
      const response = await axiosInstance.get(
        `/api/tickets/customer/${customerId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching tickets for customer ID ${customerId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Ghi log thông tin về action type để debug
   */
  logTicketRequestType(actionType: string): void {
    console.log("=== DEBUGGING TICKET CREATION ===");
    console.log("Action type received:", actionType);
    console.log("================================");
  }
}

export const ticketService = new TicketService();
