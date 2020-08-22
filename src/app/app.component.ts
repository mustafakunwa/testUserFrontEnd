import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../service/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { UserModalComponent } from './user-modal/user-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  datasource: MatTableDataSource<any>;
  displayColumn: string[] = ['#', 'firstName', 'lastName', 'email', 'mobileNo', 'action'];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private ApiService: ApiService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getAll();
  }


  getAll() {
    this.ApiService.getAll().subscribe(
      res => {
        if (res && res.length > 0) {
          this.datasource = new MatTableDataSource(res);
          this.datasource.paginator = this.paginator;
          this.datasource.sort = this.sort;
        }
      },
      err => {
        this._snackBar.open(err.message, '', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    )

  }

  newUser() {
    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '50vw',
      data: {},
      disableClose: true,
      closeOnNavigation: true
    })
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getAll()
        }
      }
    )
  }

  edit(user) {
    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '50vw',
      data: { user, isEdit: true },
      disableClose: true,
      closeOnNavigation: true
    })
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getAll()
        }
      }
    )
  }

  delete(id) {
    this.ApiService.deleteUser(id).subscribe(
      res => {
        if (res) {
          let data = this.datasource.data;
          let index = data.findIndex(user => user._id == id)
          data.splice(index)
          this.datasource = new MatTableDataSource(data);
        }
      },
      err => {
        this._snackBar.open(err.message, '', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    )
  }


}
