<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClassificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $rows = [
            [
                'classification'=>'Student Welfare Service',
                'designations'=>[
                    'Guidance',
                    'Information and Orientation Service',
                    'Alumni and Job Fair Service',
                    'Student Handbook Development',
                ]
            ],
            [
                'classification'=>'Institutional Student Program and Services',
                'designations'=>[
                    'Student Organization Activities',
                    'Leadership Training Program',
                    'Student Council Student Discipline',
                    'Student Publication'
                ]
            ],
            [
                'classification'=>'Student Development Services',
                'designations'=>[
                    'Admission and Testing Service',
                    'Scholarship',
                    'Food Service',
                    'Health Service',
                    'Safety and Security',
                    'Student Housing & Residential Service',
                    'Mult-faith',
                    'Institution Student Service',
                    'Support for Student with Special Needs',
                    'Cultural Program',
                    'Sports',
                    'Community Involvement',
                    'Research'
                ]
            ]
        ];

        foreach ($rows as $key => $row) {
            $classification_id = DB::table('classifications')->insert([
                'name'=>$row['classification']
            ]);

            foreach ($row['designations'] as $designation) {
                DB::table('designations')->insert([
                    'classification_id'=>$classification_id,
                    'name'=>$designation
                ]);
            }
        }
    }
}
