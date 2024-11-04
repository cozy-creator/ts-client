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
import type { JobStreamEventData } from './JobStreamEventData';
import {
    JobStreamEventDataFromJSON,
    JobStreamEventDataFromJSONTyped,
    JobStreamEventDataToJSON,
    JobStreamEventDataToJSONTyped,
} from './JobStreamEventData';

/**
 * 
 * @export
 * @interface JobStreamEvent
 */
export interface JobStreamEvent {
    /**
     * Indicates the type of object as 'status' or 'output'
     * @type {string}
     * @memberof JobStreamEvent
     */
    type: JobStreamEventTypeEnum;
    /**
     * 
     * @type {JobStreamEventData}
     * @memberof JobStreamEvent
     */
    data: JobStreamEventData;
}


/**
 * @export
 */
export const JobStreamEventTypeEnum = {
    Status: 'status',
    Output: 'output'
} as const;
export type JobStreamEventTypeEnum = typeof JobStreamEventTypeEnum[keyof typeof JobStreamEventTypeEnum];


/**
 * Check if a given object implements the JobStreamEvent interface.
 */
export function instanceOfJobStreamEvent(value: object): value is JobStreamEvent {
    if (!('type' in value) || value['type'] === undefined) return false;
    if (!('data' in value) || value['data'] === undefined) return false;
    return true;
}

export function JobStreamEventFromJSON(json: any): JobStreamEvent {
    return JobStreamEventFromJSONTyped(json, false);
}

export function JobStreamEventFromJSONTyped(json: any, ignoreDiscriminator: boolean): JobStreamEvent {
    if (json == null) {
        return json;
    }
    return {
        
        'type': json['type'],
        'data': JobStreamEventDataFromJSON(json['data']),
    };
}

  export function JobStreamEventToJSON(json: any): JobStreamEvent {
      return JobStreamEventToJSONTyped(json, false);
  }

  export function JobStreamEventToJSONTyped(value?: JobStreamEvent | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'type': value['type'],
        'data': JobStreamEventDataToJSON(value['data']),
    };
}

