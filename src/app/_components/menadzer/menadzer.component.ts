import { Component, OnInit, ViewChild } from '@angular/core';
import { Menadzer } from 'src/app/_models/menadzer';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ProdavacDialogComponent } from '../dialogs/prodavac-dialog/prodavac-dialog.component';
import { MenadzerService } from 'src/app/_services/menadzer.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-menadzer',
  templateUrl: './menadzer.component.html',
  styleUrls: ['./menadzer.component.css']
})
export class MenadzerComponent implements OnInit {
  displayedColumns = ['ime', 'prezime', 'pol', 'datumRodjenja', 'adresaStanovanja', 'telefon', 'JMBG', 'datumZaposlenja', 'strucnaSprema', 'adresaKancelarije', 'brojKancelarije'];
  dataSource: MatTableDataSource<Menadzer>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public menadzerService: MenadzerService, public dialog: MatDialog, public snackBar: MatSnackBar) { }

  ngOnInit() { }

  public loadData() {
    this.menadzerService.getMenadzeri().subscribe(data => {
      if (!Array.isArray(data)) return;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sortingDataAccessor = (data, property) => {
        if (data[property]) return data[property].toLocaleLowerCase();
      };

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
      error => {
        this.snackBar.open(error, "U redu", {
          duration: 2000,
          panelClass: ['red-snackbar']
        });
      });
  }

  public openDialog(flag: number, prodavacID: number,
    ime: string,
    prezime: string,
    pol: string,
    datumRodjenja: string,
    adresaStanovanja: string,
    telefon: string,
    JMBG: string,
    datumZaposlenja: string,
    strucnaSprema: string) {
    const dialogRef = this.dialog.open(ProdavacDialogComponent, {
      data: {
        i: prodavacID, prodavacID: prodavacID, ime: ime, prezime: prezime, pol: pol,
        datumRodjenja: datumRodjenja, adresaStanovanja: adresaStanovanja, telefon: telefon, JMBG: JMBG
        , datumZaposlenja: datumZaposlenja, strucnaSprema: strucnaSprema
      }
    });

    dialogRef.componentInstance.flag = flag;

    dialogRef.afterClosed().subscribe(result => {
      if (result == 1)
        this.loadData();
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
