/* tslint:disable */
/* eslint-disable */
/**
 * Cozy Creator
 * Cozy Creator OpenAPI specification
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { UploadResponseData } from './UploadResponseData';
import {
    UploadResponseDataFromJSON,
    UploadResponseDataFromJSONTyped,
    UploadResponseDataToJSON,
    UploadResponseDataToJSONTyped,
} from './UploadResponseData';

/**
 * 
 * @export
 * @interface UploadResponse
 */
export interface UploadResponse {
    /**
     * Status of the upload request
     * @type {string}
     * @memberof UploadResponse
     */
    status?: string;
    /**
     * 
     * @type {UploadResponseData}
     * @memberof UploadResponse
     */
    data?: UploadResponseData;
}

/**
 * Check if a given object implements the UploadResponse interface.
 */
export function instanceOfUploadResponse(value: object): value is UploadResponse {
    return true;
}

export function UploadResponseFromJSON(json: any): UploadResponse {
    return UploadResponseFromJSONTyped(json, false);
}

export function UploadResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): UploadResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'status': json['status'] == null ? undefined : json['status'],
        'data': json['data'] == null ? undefined : UploadResponseDataFromJSON(json['data']),
    };
}

  export function UploadResponseToJSON(json: any): UploadResponse {
      return UploadResponseToJSONTyped(json, false);
  }

  export function UploadResponseToJSONTyped(value?: UploadResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'status': value['status'],
        'data': UploadResponseDataToJSON(value['data']),
    };
}

