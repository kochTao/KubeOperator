import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Region} from '../../region/region';
import {RegionService} from '../../region/region.service';
import {TipService} from '../../tip/tip.service';
import {TipLevels} from '../../tip/tipLevels';
import {Zone} from '../zone';
import {ZoneService} from '../zone.service';
import {ZoneDetailComponent} from '../zone-detail/zone-detail.component';

@Component({
  selector: 'app-zone-list',
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.css']
})
export class ZoneListComponent implements OnInit {

  items: Zone[] = [];
  selected: Zone[] = [];
  loading = false;
  showDelete = false;
  showDetail = false;
  resourceTypeName: '可用区';
  @Output() add = new EventEmitter();
  @ViewChild(ZoneDetailComponent, { static: true })
  child: ZoneDetailComponent;

  constructor(private regionService: RegionService, private tipService: TipService, private zoneService: ZoneService) {
  }


  ngOnInit() {
    this.listItems();
  }

  listItems() {
    this.zoneService.listZones().subscribe((data) => {
      this.items = data;
    });
  }

  delete() {
    const promises: Promise<{}>[] = [];
    this.selected.forEach(item => {
        promises.push(this.zoneService.deleteZone(item.name).toPromise());
      }
    );
    Promise.all(promises).then(data => {
      this.tipService.showTip('删除成功', TipLevels.SUCCESS);
    }, error => {
      this.tipService.showTip('删除失败' + error.toString(), TipLevels.ERROR);
    }).finally(
      () => {
        this.showDelete = false;
        this.listItems();
        this.selected = [];
      }
    );
  }

  onShowDetail(item: Zone) {
    this.child.currentZone = item;
    this.showDetail = true;
  }

  refresh() {
    this.listItems();
  }

  addItem() {
    this.add.emit();
  }

}
