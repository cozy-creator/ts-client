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
/**
 * 
 * @export
 * @interface WorkflowOutput
 */
export interface WorkflowOutput {
    /**
     * The ID of the node producing the output
     * @type {string}
     * @memberof WorkflowOutput
     */
    nodeID?: string;
    /**
     * The type of the node
     * @type {string}
     * @memberof WorkflowOutput
     */
    nodeType?: string;
    /**
     * 
     * @type {{ [key: string]: object; }}
     * @memberof WorkflowOutput
     */
    output?: { [key: string]: object; };
    /**
     * An error message, if any
     * @type {string}
     * @memberof WorkflowOutput
     */
    error?: string;
}

/**
 * Check if a given object implements the WorkflowOutput interface.
 */
export function instanceOfWorkflowOutput(value: object): value is WorkflowOutput {
    return true;
}

export function WorkflowOutputFromJSON(json: any): WorkflowOutput {
    return WorkflowOutputFromJSONTyped(json, false);
}

export function WorkflowOutputFromJSONTyped(json: any, ignoreDiscriminator: boolean): WorkflowOutput {
    if (json == null) {
        return json;
    }
    return {
        
        'nodeID': json['nodeID'] == null ? undefined : json['nodeID'],
        'nodeType': json['nodeType'] == null ? undefined : json['nodeType'],
        'output': json['output'] == null ? undefined : json['output'],
        'error': json['error'] == null ? undefined : json['error'],
    };
}

  export function WorkflowOutputToJSON(json: any): WorkflowOutput {
      return WorkflowOutputToJSONTyped(json, false);
  }

  export function WorkflowOutputToJSONTyped(value?: WorkflowOutput | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'nodeID': value['nodeID'],
        'nodeType': value['nodeType'],
        'output': value['output'],
        'error': value['error'],
    };
}

