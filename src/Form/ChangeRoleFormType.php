<?php

namespace App\Form;

use App\Entity\Role;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ChangeRoleFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('role_key')
            ->add('name')
            ->add('color')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            // Убираем валидацию sumbit'a
            'validation_groups' => false,
            'csrf_field_name' => '_csrf_token',
            'csrf_token_id'   => 'change_role_form',
            'data_class' => Role::class,
        ]);
    }
}
