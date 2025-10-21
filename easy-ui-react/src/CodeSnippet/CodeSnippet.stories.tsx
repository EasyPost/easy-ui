import { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { CodeSnippet, CodeSnippetProps } from "./CodeSnippet";
import { SnippetLanguages, SnippetLanguage } from "./SyntaxHighlighter";

type Story = StoryObj<typeof CodeSnippet>;

const Template = (args: CodeSnippetProps) => (
  <CodeSnippet {...args} code={getSnippets()[args.language]} />
);

const meta: Meta<typeof CodeSnippet> = {
  title: "Components/Code/CodeSnippet",
  component: CodeSnippet,
  args: {
    language: SnippetLanguages.JAVASCRIPT,
    showLineNumbers: false,
    maxLines: undefined,
  },
  excludeStories: ["getSnippets", "getSnippetEntries"],
};

export default meta;

export const Default: Story = {
  render: Template.bind({}),
};

export const LineNumbers: Story = {
  render: Template.bind({}),
  args: {
    showLineNumbers: true,
  },
};

export const MaxLines: Story = {
  render: Template.bind({}),
  args: {
    maxLines: 8,
    showLineNumbers: true,
  },
};

export function getSnippetEntries() {
  return Object.entries(getSnippets()) as [SnippetLanguage, string][];
}

export function getSnippets() {
  return {
    [SnippetLanguages.CSHARP]: `using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;
using EasyPost;
using EasyPost.Models.API;
using EasyPost.Parameters;

namespace EasyPostExamples
{
    public class Examples
    {
        public static async Task Main()
        {
            string apiKey = Environment.GetEnvironmentVariable("EASYPOST_API_KEY")!;

            var client = new EasyPost.Client(apiKey);

            Parameters.Tracker.Create parameters = new()
            {
                TrackingCode = "EZ1000000001",
                Carrier = "USPS"
            };

            Tracker tracker = await client.Tracker.Create(parameters);

            Console.WriteLine(JsonConvert.SerializeObject(tracker, Formatting.Indented));
        }
    }
}`,
    [SnippetLanguages.GO]: `package example

import (
  "fmt"
  "os"

  "github.com/EasyPost/easypost-go/v2"
)

func main() {
  apiKey := os.Getenv("EASYPOST_API_KEY")
  client := easypost.New(apiKey)

  tracker, _ := client.CreateTracker(
    &easypost.CreateTrackerOptions{
      TrackingCode: "EZ1000000001",
      Carrier:      "USPS",
    },
  )

  fmt.Println(tracker)
}`,
    [SnippetLanguages.JAVA]: `package trackers;

import com.easypost.exception.EasyPostException;
import com.easypost.model.Tracker;
import com.easypost.service.EasyPostClient;

import java.util.HashMap;

public class Create {
    public static void main(String[] args) throws EasyPostException {
        EasyPostClient client = new EasyPostClient(System.getenv("EASYPOST_API_KEY"));

        HashMap<String, Object> params = new HashMap<String, Object>();
        params.put("tracking_code", "EZ1000000001");
        params.put("carrier", "USPS");

        Tracker tracker = client.tracker.create(params);

        System.out.println(tracker);
    }
}`,
    [SnippetLanguages.JAVASCRIPT]: `const EasyPostClient = require('@easypost/api');

const client = new EasyPostClient(process.env.EASYPOST_API_KEY);

(async () => {
  const tracker = await client.Tracker.create({
    tracking_code: 'EZ1000000001',
    carrier: 'USPS',
  });

  console.log(tracker);
})();`,
    [SnippetLanguages.JSON]: `{
  "id": "trk_52af8b25ec1a4ca687a9691e0dc2198b",
  "object": "Tracker",
  "mode": "test",
  "tracking_code": "EZ1000000001",
  "status": "pre_transit",
  "status_detail": "status_update",
  "created_at": "2022-10-17T17:51:57Z",
  "updated_at": "2022-10-17T17:51:57Z",
  "signed_by": null,
  "weight": null,
  "est_delivery_date": "2022-10-17T17:51:57Z",
  "shipment_id": null,
  "carrier": "USPS",
  "tracking_details": [
    {
      "object": "TrackingDetail",
      "message": "Pre-Shipment Info Sent to USPS",
      "description": null,
      "status": "pre_transit",
      "status_detail": "status_update",
      "datetime": "2022-09-17T17:51:57Z",
      "source": "USPS",
      "carrier_code": null,
      "tracking_location": {
        "object": "TrackingLocation",
        "city": null,
        "state": null,
        "country": null,
        "zip": null
      }
    },
    {
      "object": "TrackingDetail",
      "message": "Shipping Label Created",
      "description": null,
      "status": "pre_transit",
      "status_detail": "status_update",
      "datetime": "2022-09-18T06:28:57Z",
      "source": "USPS",
      "carrier_code": null,
      "tracking_location": {
        "object": "TrackingLocation",
        "city": "HOUSTON",
        "state": "TX",
        "country": null,
        "zip": "77063"
      }
    }
  ],
  "carrier_detail": {
    "object": "CarrierDetail",
    "service": "First-Class Package Service",
    "container_type": null,
    "est_delivery_date_local": null,
    "est_delivery_time_local": null,
    "origin_location": "HOUSTON TX, 77001",
    "origin_tracking_location": {
      "object": "TrackingLocation",
      "city": "HOUSTON",
      "state": "TX",
      "country": null,
      "zip": "77063"
    },
    "destination_location": "CHARLESTON SC, 29401",
    "destination_tracking_location": null,
    "guaranteed_delivery_date": null,
    "alternate_identifier": null,
    "initial_delivery_attempt": null
  },
  "finalized": true,
  "is_return": false,
  "public_url": "https://track.easypost.com/djE6dHJrXzUyYWY4YjI1ZWMxYTRjYTY4N2E5NjkxZTBkYzIxOThi",
  "fees": [
    {
      "object": "Fee",
      "type": "TrackerFee",
      "amount": "0.02000",
      "charged": false,
      "refunded": false
    }
  ]
}`,
    [SnippetLanguages.PHP]: `<?php

$client = new \EasyPost\EasyPostClient(getenv('EASYPOST_API_KEY'));

$tracker = $client->tracker->create([
    'tracking_code' => 'EZ1000000001',
    'carrier' => 'USPS'
]);

echo $tracker;`,
    [SnippetLanguages.PYTHON]: `import os

import easypost

client = easypost.EasyPostClient(os.getenv("EASYPOST_API_KEY"))

tracker = client.tracker.create(
    tracking_code="EZ1000000001",
    carrier="USPS",
)

print(tracker)`,
    [SnippetLanguages.RUBY]: `require 'easypost'

client = EasyPost::Client.new(api_key: ENV['EASYPOST_API_KEY'])

tracker = client.tracker.create(
  tracking_code: 'EZ1000000001',
  carrier: 'USPS',
)

puts tracker`,
    [SnippetLanguages.SHELL]: `curl -X POST https://api.easypost.com/v2/trackers \
-u "$EASYPOST_API_KEY": \
-H 'Content-Type: application/json' \
-d '{
  "tracker": {
    "tracking_code": "EZ1000000001",
    "carrier": "USPS"
  }
}'`,
  };
}
