import { MatPaginatorIntl } from '@angular/material';
const dutchRangeLabel = (page: number, pageSize: number, length: number) => {
	if (length == 0 || pageSize == 0) { return `0 de ${length}`; }

	length = Math.max(length, 0);

	const startIndex = page * pageSize;

	// If the start index exceeds the list length, do not try and fix the end index to the end.
	const endIndex = startIndex < length ?
		Math.min(startIndex + pageSize, length) :
		startIndex + pageSize;

	return `Mostrando ${endIndex} de ${length}`;
  }
export function changePaginator(){
	const paginatorIntl = new MatPaginatorIntl();
	paginatorIntl.itemsPerPageLabel = ""; // Itens por página
	paginatorIntl.nextPageLabel = "Próxima página";
	paginatorIntl.previousPageLabel = "Página anterior";
	paginatorIntl.getRangeLabel = dutchRangeLabel;
	return paginatorIntl;
}
