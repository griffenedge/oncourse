/*
 * Copyright ish group pty ltd 2020.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License version 3 as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 */
package ish.messaging;

import ish.math.Money;
import ish.oncourse.cayenne.PersistentObjectI;
import ish.oncourse.server.cayenne.Contact;

import java.time.LocalDate;
import java.util.List;

/**
 */
public interface IInvoice extends PersistentObjectI {


	Money getAmountOwing();

	Money getAmountPaid();

	Contact getContact();

	LocalDate getInvoiceDate();

	LocalDate getDateDue();

	List<? extends IInvoiceLine> getInvoiceLines();

	Long getInvoiceNumber();

	Money getTotal();

	Money getTotalTax();

	Money getTotalIncTax();

	String getDescription();

	ICorporatePass getCorporatePassUsed();

	String getCustomerReference();
}
