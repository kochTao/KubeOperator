import logging
import uuid

import requests
from django.db import models
from common import models as common_models
from django.utils.translation import ugettext_lazy as _

__all__ = ['Package']

Logger = logging.getLogger(__name__)


class Package(models.Model):
    PACKAGE_STATUS_VALID = "valid"
    PACKAGE_STATUS_INVALID = "invalid"
    PACKAGE_STATUS_UNKNOWN = "unknown"
    PACKAGE_STATUS_CHOICES = (
        (PACKAGE_STATUS_VALID, 'valid'),
        (PACKAGE_STATUS_INVALID, 'invalid'),
        (PACKAGE_STATUS_UNKNOWN, 'unknown')
    )

    id = models.UUIDField(default=uuid.uuid4, primary_key=True)
    name = models.CharField(max_length=20, unique=True, verbose_name=_('Name'))
    endpoint = models.CharField(max_length=255, null=True, default='')
    meta = common_models.JsonDictTextField(default={})
    date_created = models.DateTimeField(auto_now_add=True, verbose_name=_('Date created'))
    status = models.CharField(max_length=128, null=True, default=PACKAGE_STATUS_UNKNOWN, choices=PACKAGE_STATUS_CHOICES)

    def health_check(self):
        result = False
        try:
            print(self.endpoint + "/api/health")
            req = requests.get("http://127.0.0.1:5000/api/health")
            if req.ok:
                result = True
        except Exception as e:
            result = False
            Logger.error(e.__str__())
        if result:
            self.status = Package.PACKAGE_STATUS_VALID
        else:
            self.status = Package.PACKAGE_STATUS_INVALID

    def on_package_save(self):
        pass
        # self.health_check()


class Meta:
    verbose_name = _('Package')
