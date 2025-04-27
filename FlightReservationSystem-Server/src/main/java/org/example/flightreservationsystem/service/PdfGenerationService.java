package org.example.flightreservationsystem.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.example.flightreservationsystem.model.ReservationDTO;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfGenerationService {

    public byte[] generateReservationPdf(ReservationDTO reservation) throws DocumentException {
        Document document = new Document();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, outputStream);

        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK);
        Paragraph title = new Paragraph("Flight Reservation Confirmation", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20f);
        document.add(title);

        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.BLACK);
        Font contentFont = FontFactory.getFont(FontFactory.HELVETICA, 12, BaseColor.BLACK);

        document.add(new Paragraph("Passenger Information:", headerFont));
        document.add(new Paragraph("Name: " + reservation.getPassengerFirstname() + " " +
                reservation.getPassengerLastname(), contentFont));
        document.add(new Paragraph("Email: " + reservation.getPassengerEmail(), contentFont));
        document.add(new Paragraph("Reservation Code: " + reservation.getReservationCode(), contentFont));
        document.add(new Paragraph("Booking Date: " +
                reservation.getReservationDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")), contentFont));
        document.add(new Paragraph("Number of Seats: " + reservation.getSeatsReserved(), contentFont));
        document.add(new Paragraph("Total Price: $" + reservation.getTotalPrice(), contentFont));
        document.add(Chunk.NEWLINE);

        document.add(new Paragraph("Flight Details:", headerFont));
        document.add(new Paragraph("Flight Number: " + reservation.getFlight().getFlightCode(), contentFont));

        PdfPTable flightTable = new PdfPTable(2);
        flightTable.setWidthPercentage(100);
        flightTable.setSpacingBefore(10f);
        flightTable.setSpacingAfter(10f);

        addFlightTableHeader(flightTable);
        addFlightTableData(flightTable, reservation);

        document.add(flightTable);
        document.add(Chunk.NEWLINE);

        document.add(new Paragraph("Terms and Conditions:", headerFont));
        document.add(new Paragraph("- Tickets are non-refundable", contentFont));
        document.add(new Paragraph("- Check-in at least 2 hours before departure", contentFont));
        document.add(new Paragraph("- Present this confirmation and valid ID at check-in", contentFont));

        document.close();
        return outputStream.toByteArray();
    }

    private void addFlightTableHeader(PdfPTable table) {
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.WHITE);

        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(BaseColor.DARK_GRAY);
        cell.setPadding(5);
        cell.setPhrase(new Phrase("Departure", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Arrival", font));
        table.addCell(cell);
    }

    private void addFlightTableData(PdfPTable table, ReservationDTO reservation) {
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        String departure = reservation.getFlight().getDepartureCity().getCityName() + "\n" +
                reservation.getFlight().getDepartureDatetime().format(dateFormatter) + "\n" +
                reservation.getFlight().getDepartureDatetime().format(timeFormatter);

        String arrival = reservation.getFlight().getArrivalCity().getCityName() + "\n" +
                reservation.getFlight().getArrivalDatetime().format(dateFormatter) + "\n" +
                reservation.getFlight().getArrivalDatetime().format(timeFormatter);

        table.addCell(departure);
        table.addCell(arrival);
    }
}