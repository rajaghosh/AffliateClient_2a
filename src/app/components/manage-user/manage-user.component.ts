import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/service/http-services/user.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent {
  rowsAdded: boolean = false;
  displayedColumns: string[] = ['id', 'name', 'email', 'isActive'];
  userDetailsList!: any[]
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userServices: UserService, private matDialog: MatDialog
    ) {

  }

  ngOnInit() {
    this.getUserDetails();
  } 

  getUserDetails() { 
    this.userServices.getAfficiateUserDetails().subscribe(response => {
      if(response.data != null) {
        //debugger;
        this.userDetailsList = response.data;
        //console.log("paymentList : " + this.paymentList);
        this.dataSource = new MatTableDataSource<any>(this.userDetailsList); 
        setTimeout(() => this.dataSource.paginator = this.paginator);
        setTimeout(() => this.dataSource.sort = this.sort);
        this.rowsAdded = this.dataSource.data.length > 0; 
        
      }
      else {
        // error module yet not implemented.
      }
    }); 
  }
  userActivation(event: any, id: number, email: string) {
    console.log(event);
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you want to change the user status?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      // debugger;
      if (confirmed) {
        const a = document.createElement('a');
        a.click();
        a.remove();
        this.StatusUpdate(event.checked, id, email);
      }
      else {
        this.toggleSlidByCheckedValue(event.checked, id);
      }
    });
  }

  StatusUpdate(status: boolean, id: number, email: string) {
    this.userServices.activeOrInActiveUser(status, id, email).subscribe(s => {
      if (s.data && s.data > 0) {
        this.openAlertDialog("User status updated successfully.");
      }
      else {
        this.openAlertDialog("error occurred. please contact support team.");
        this.toggleSlidByCheckedValue(!status, id);
      }
    });
  }

  toggleSlidByCheckedValue(checked: boolean, id: number) {
    // debugger;

    this.userDetailsList?.map(m => {
      if (m.id == id) {
        m.isActive = !checked;
      }
    });
  }

  openAlertDialog(alertMessage: string) {
    const dialogRef = this.matDialog.open(AlertDialogComponent, {
    //   width: '80%',
    // height:'80%',
      data: {
        message: alertMessage,
        
        buttonText: {
          cancel: "OK",
        },
      },
    });
  }
}
