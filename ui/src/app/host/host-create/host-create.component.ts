import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Host} from '../host';
import {HostService} from '../host.service';
import {TipService} from '../../tip/tip.service';
import {TipLevels} from '../../tip/tipLevels';
import {Credential} from '../../credential/credential-list/credential';
import {CredentialService} from '../../credential/credential.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-host-create',
  templateUrl: './host-create.component.html',
  styleUrls: ['./host-create.component.css']
})
export class HostCreateComponent implements OnInit {

  constructor(private hostService: HostService, private tipService: TipService, private credentialService: CredentialService) {
  }

  @Output() create = new EventEmitter<boolean>();
  staticBackdrop = true;
  closable = false;
  createHostOpened: boolean;
  isSubmitGoing = false;
  host: Host = new Host();
  loading = false;
  credentials: Credential[] = [];
  @ViewChild('hostForm', {static: true}) hostFrom: NgForm;

  ngOnInit() {

  }


  listCredential() {
    this.credentialService.listCredential().subscribe(data => {
      this.credentials = data;
    });
  }


  reset() {
    this.hostFrom.resetForm();
    this.listCredential();
  }


  onCancel() {
    this.createHostOpened = false;
  }

  onSubmit() {
    if (this.isSubmitGoing) {
      return;
    }
    this.isSubmitGoing = true;
    this.loading = true;
    this.hostService.createHost(this.host).subscribe(data => {
      this.createHostOpened = false;
      this.isSubmitGoing = false;
      this.create.emit(true);
      this.loading = false;
      this.tipService.showTip('创建主机成功', TipLevels.SUCCESS);
    }, err => {
      this.createHostOpened = false;
      this.isSubmitGoing = false;
      this.create.emit(true);
      this.loading = false;
      this.tipService.showTip('创建主机失败：无法连接到目标主机！请检查目标主机22端口是否开启!', TipLevels.ERROR);
    });
  }

  newHost() {
    this.host = new Host();
    this.reset();
    this.createHostOpened = true;
  }
}
